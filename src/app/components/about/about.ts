import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RouterLink, TranslateModule],
  templateUrl: './about.html',
  styleUrls: ['./about.css']
})
export class About {}
