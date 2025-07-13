import { Test, TestingModule } from '@nestjs/testing';
import { GrupoFaqController } from './grupo-faq.controller';
import { GrupoFaqService } from './grupo-faq.service';

describe('GrupoFaqController', () => {
  let controller: GrupoFaqController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GrupoFaqController],
      providers: [GrupoFaqService],
    }).compile();

    controller = module.get<GrupoFaqController>(GrupoFaqController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
