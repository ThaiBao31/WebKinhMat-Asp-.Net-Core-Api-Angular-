import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { TestService } from './services/test.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  glasses: string[] = [];
  showHeaderFooter: boolean = true;

  constructor(private apiService: TestService, private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Kiểm tra đường dẫn hiện tại
        this.showHeaderFooter = !event.url.includes('/admin');
      }
    });
  }

  ngOnInit(): void {
    this.apiService.getGlasses().subscribe(data => {
      this.glasses = data;
    });
  }
}
