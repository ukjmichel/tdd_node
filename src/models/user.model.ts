// src/models/user.model.ts
import { Column, Model, Table, DataType } from 'sequelize-typescript';
import bcrypt from 'bcrypt';

import { Optional } from 'sequelize';

interface UserAttributes {
  id: string;
  name: string;
  email: string;
  password: string;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

@Table({ tableName: 'users', timestamps: true })
class UserModel
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  public id!: string;

  @Column(DataType.STRING)
  public name!: string;

  @Column(DataType.STRING)
  public email!: string;

  @Column(DataType.STRING)
  public password!: string;

  public async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}

export { UserModel };
