export interface HeartbeatEntity {
  id?: string;
  userId: string;
  entity: string;
  project?: string | null;
  language?: string | null;
  framework?: string | null;
  editor?: string | null;
  branch?: string | null;
  operatingSystem?: string | null;
  machine?: string | null;
  isWrite: boolean;
  activityAt: Date;
}

export interface UserEntity {
  id: string;
  email: string;
  name?: string | null;
}

export interface ItemStat {
  name: string;
  time: number;
}

export interface AggregatedStats {
  totalSeconds: number;
  languages: ItemStat[];
  projects: ItemStat[];
  frameworks: ItemStat[];
}
