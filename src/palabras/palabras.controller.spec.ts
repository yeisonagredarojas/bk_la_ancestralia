import { Test, TestingModule } from '@nestjs/testing';
import { PalabrasController } from './palabras.controller';

describe('PalabrasController', () => {
  let controller: PalabrasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PalabrasController],
    }).compile();

    controller = module.get<PalabrasController>(PalabrasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
