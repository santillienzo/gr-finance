import bcrypt from 'bcryptjs';
import { AppDataSource } from '../config/database';
import { User } from '../entities/User';
import { Box } from '../entities/Box';
import { BoxType } from '../types';

export const seedDatabase = async (): Promise<void> => {
  const userRepository = AppDataSource.getRepository(User);
  const boxRepository = AppDataSource.getRepository(Box);

  const usersToSeed = [
    { username: 'admin', password: 'admin123', name: 'Administrador' },
    { username: 'juanma', password: 'juanmaGR2026', name: 'Juanma' },
    { username: 'joaquin', password: 'joaquinGR2026', name: 'Joaquin' },
  ];

  for (const userData of usersToSeed) {
    const existingUser = await userRepository.findOne({ where: { username: userData.username } });
    if (!existingUser) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = userRepository.create({
        username: userData.username,
        password: hashedPassword,
        name: userData.name,
      });
      await userRepository.save(user);
      console.log(`User created: ${userData.username}`);
    }
  }

  const existingBoxes = await boxRepository.count();
  
  if (existingBoxes === 0) {
    const boxes = [
      { name: 'Caja Efectivo', type: BoxType.EFECTIVO, balance: 0 },
      { name: 'Caja Cheques', type: BoxType.CHEQUES, balance: 0 },
      { name: 'Caja Transferencias', type: BoxType.TRANSFERENCIAS, balance: 0 },
    ];

    for (const boxData of boxes) {
      const box = boxRepository.create(boxData);
      await boxRepository.save(box);
    }
    console.log('Default boxes created');
  }
};
