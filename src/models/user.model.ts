import {
  Column,
  Model,
  Table,
  DataType,
  BeforeCreate,
  BeforeUpdate,
} from 'sequelize-typescript';
import bcrypt from 'bcrypt';
import { BOOLEAN, Optional } from 'sequelize';

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
    unique: true,
  })
  public id!: string;

  @Column({
    type: DataType.STRING,
    unique: true,
    validate: {
      len: [2, 20],
      is: /^[a-zA-Z0-9]+$/,
    },
  })
  public name!: string;

  @Column({
    type: DataType.STRING,
    unique: true,
    validate: {
      isEmail: true,
    },
  })
  public email!: string;

  @Column(DataType.STRING)
  public password!: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  public isVerified!: boolean;

  public async validatePassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
  }

  @BeforeCreate
  @BeforeUpdate
  static async hashPassword(instance: UserModel) {
    if (instance.changed('password')) {
      const salt = await bcrypt.genSalt(10);
      instance.password = await bcrypt.hash(instance.password, salt);
    }
  }
}

export { UserModel };
