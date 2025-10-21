import { Test, TestingModule } from '@nestjs/testing';
import { PalabrasService } from './palabras.service';

describe('PalabrasService', () => {
  let service: PalabrasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PalabrasService],
    }).compile();

    service = module.get<PalabrasService>(PalabrasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
