import { TestBed } from '@angular/core/testing';

import { OrderStatsService } from './order-stats.service';

describe('OrderStatsService', () => {
  let service: OrderStatsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrderStatsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
