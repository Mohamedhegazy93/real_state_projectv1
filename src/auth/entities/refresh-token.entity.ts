// src/auth/entities/refresh-token.entity.ts
import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity()
export class RefreshToken {
  @PrimaryColumn()
  refreshToken: string; 

  @ManyToOne(() => User, (user) => user.refreshTokens, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: number; 

  @Column({ type: 'timestamp' })
  expiresAt: Date;

}