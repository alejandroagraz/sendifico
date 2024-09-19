import { DataSource } from 'typeorm';
import { runSeeders, Seeder } from 'typeorm-extension';
import UserSeeder from './seeds/user.seeder';
import userFactory from './factories/user.factory';

export default class InitSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    await runSeeders(dataSource, {
      seeds: [UserSeeder],
      factories: [userFactory],
    });
  }
}
