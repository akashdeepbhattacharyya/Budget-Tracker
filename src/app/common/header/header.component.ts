import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { LoaderService } from '../../services/loader/loader.service';
import { ApiService } from '../../services/auth-services/auth.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterModule, MatProgressBarModule, MatButtonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  user: string | null = '';
  constructor(
    public loaderService: LoaderService,
    public authService: ApiService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getUserName();
  }
}
