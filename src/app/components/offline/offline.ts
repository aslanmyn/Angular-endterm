import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-offline',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './offline.html',
  styleUrls: ['./offline.css']
})
export class Offline {}





