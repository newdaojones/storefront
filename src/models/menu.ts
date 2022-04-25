export interface IMenuItem {
  route: string;
  icon?: any;
  text?: string;
  subItems?: IMenuItem[];
}

export interface IRoateItem {
  background: string;
  text: string;
}
