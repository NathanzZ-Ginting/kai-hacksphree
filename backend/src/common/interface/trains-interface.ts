// Train interfaces
export interface Train {
  uuid: string;
  categoryId?: string;
  trainCode?: string;
  name?: string;
  createdAt: Date;
  updatedAt: Date;
}