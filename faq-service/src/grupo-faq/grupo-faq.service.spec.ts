import { Test, TestingModule } from '@nestjs/testing';
import { GrupoFaqService } from './grupo-faq.service';

describe('GrupoFaqService', () => {
  let service: GrupoFaqService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GrupoFaqService],
    }).compile();

    service = module.get<GrupoFaqService>(GrupoFaqService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
