import * as vscode from "vscode";
import axios from "axios";
import { HeartbeatQueue } from "./queue";

export class DevTimeClient {
  static async flush(queue: HeartbeatQueue, statusBar: vscode.StatusBarItem): Promise<void> {
    const items = queue.getAll();
    if (items.length === 0) return;

    const config = vscode.workspace.getConfiguration("devtime");
    const apiKey = config.get<string>("apiKey")?.trim();
    let apiUrl = config.get<string>("apiUrl");
    if (!apiUrl || apiUrl.includes("localhost:3000")) {
      apiUrl = "https://wakatime-devtime.vercel.app";
    }
    apiUrl = apiUrl.trim().replace(/\/+$/, "");

    if (!apiKey) {
      statusBar.text = "$(stop) DevTime: No Key";
      statusBar.tooltip = "Click to set your DevTime API Key";
      return;
    }

    try {
      const response = await axios.post(
        `${apiUrl}/api/heartbeats`,
        { heartbeats: items },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          timeout: 5000,
        }
      );

      if (response.status === 200) {
        queue.clear();
        await this.updateTodayDuration(apiUrl, apiKey, statusBar);
      }
    } catch (err: any) {
      const status = err.response?.status;
      const data = err.response?.data;

      if (status === 401) {
        statusBar.text = "$(error) DevTime: Invalid Key";
        statusBar.tooltip = "API Key is invalid or expired. Click to re-enter.";
      } else if (err.code === "ECONNREFUSED" || !err.response) {
        const count = queue.size;
        statusBar.text = `$(sync) DevTime: Offline (${count} queued)`;
        statusBar.tooltip = `Cannot reach ${apiUrl}. Events are safely stored offline in queue.`;
      } else {
        statusBar.text = `$(sync) DevTime: Error`;
        statusBar.tooltip = data?.error || err.message;
      }
    }
  }

  static async updateTodayDuration(apiUrl: string, apiKey: string, statusBar: vscode.StatusBarItem): Promise<void> {
    try {
      const res = await axios.get(`${apiUrl}/api/stats?range=today`, {
        headers: { Authorization: `Bearer ${apiKey}` },
        timeout: 4000,
      });

      if (res.data?.totalSeconds !== undefined) {
        const total = res.data.totalSeconds;
        const hrs = Math.floor(total / 3600);
        const mins = Math.floor((total % 3600) / 60);
        const timeStr = hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;

        statusBar.text = `$(clock) DevTime: ${timeStr}`;
        statusBar.tooltip = `DevTime Active • Today's Time: ${timeStr} • Click for status`;
      } else {
        statusBar.text = "$(check) DevTime: Active";
      }
    } catch {
      statusBar.text = "$(check) DevTime: Active";
    }
  }
}
