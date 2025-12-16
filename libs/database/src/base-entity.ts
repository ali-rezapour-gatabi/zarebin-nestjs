import { CreateDateColumn, Entity, ObjectId, ObjectIdColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class BaseEntity {
  @ObjectIdColumn()
  _id: ObjectId;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
