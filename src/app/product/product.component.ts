import { Component, input, OnInit} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Product } from '../../models/product';
import { CalendarModule } from 'primeng/calendar';
import { CommonModule } from '@angular/common';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule,FormsModule, CalendarModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent {
  date: Date[] | undefined;
  product = input.required<Product>();
  fr: any;

  disabledDates: Date[] = [
    new Date(2024, 8, 15), // 15 Septembre 2024 (les mois commencent à 0 en JavaScript, donc 8 = Septembre)
    new Date(2024, 8, 21), // 21 Septembre 2024
    new Date(2024, 9, 10), // 10 Octobre 2024
  ];
  // ngOnInit():void {
  //   this.fr =
  // };
  constructor(private primengConfig: PrimeNGConfig) {
    this.fr = {
      firstDayOfWeek: 1,
      dayNames: ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"],
      dayNamesShort: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
      dayNamesMin: ["D", "L", "M", "M", "J", "V", "S"],
      monthNames: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"],
      monthNamesShort: ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Aoû", "Sep", "Oct", "Nov", "Déc"],
      today: 'Aujourd\'hui',
      clear: 'Effacer',
      dateFormat: 'dd/mm/yy',
      weekHeader: 'Sem'
    };
    this.primengConfig.setTranslation(this.fr);
  }
}
