import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-auth',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './auth.html',
  styleUrl: './auth.css',
})
export class Auth {}
