import * as vscode from "vscode";

export class DevTimeLogger {
  private static channel: vscode.OutputChannel;

  static init() {
    if (!this.channel) {
      this.channel = vscode.window.createOutputChannel("DevTime");
    }
  }

  static log(message: string, data?: any) {
    this.init();
    const timestamp = new Date().toISOString();
    const formatted = data ? `${message} ${JSON.stringify(data, null, 2)}` : message;
    this.channel.appendLine(`[${timestamp}] [INFO] ${formatted}`);
  }

  static error(message: string, error?: any) {
    this.init();
    const timestamp = new Date().toISOString();
    let errDetails = "";
    if (error) {
      if (error.response) {
        errDetails = `HTTP ${error.response.status}: ${JSON.stringify(error.response.data)}`;
      } else {
        errDetails = error.stack || error.message || JSON.stringify(error);
      }
    }
    this.channel.appendLine(`[${timestamp}] [ERROR] ${message} ${errDetails}`);
  }

  static show() {
    this.init();
    this.channel.show(true);
  }
}
