import { Component, input, OnInit} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { Product } from '../../models/product';

import { PrimeNGConfig } from 'primeng/api';
import { ReservationService } from '../registration.service'; // Import du service

import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';
import { DataViewModule } from 'primeng/dataview';
import { TimeSlot } from '../interfaces/slot';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule,FormsModule, DataViewModule, ButtonModule, CalendarModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent implements OnInit {
  date: Date = new Date();
  product = input.required<Product>();
  fr: any;

  // Liste des créneaux horaires
  timeSlots: TimeSlot[] = [];
  selectedSlot: TimeSlot = {value: "", available: true};
  disabledDates: Date[] = [
    new Date(2024, 8, 15), // 15 Septembre 2024 (les mois commencent à 0 en JavaScript, donc 8 = Septembre)
    new Date(2024, 8, 21), // 21 Septembre 2024
    new Date(2024, 9, 10), // 10 Octobre 2024
  ];
  reservedDates: Date[] = [];
  subscription: Subscription = new Subscription;
  ngOnInit() {
    // Générer les créneaux horaires de 30 minutes de 08:00 à 18:00
    this.generateTimeSlots();

    this.subscription = this.reservationService.reservedDates$.subscribe(dates => {
      this.reservedDates = dates;

      // Parcourir tous les créneaux horaires
      this.timeSlots.forEach(slot => {
        // Pour chaque créneau, vérifier s'il existe dans reservedDates
        const isReserved = this.reservedDates.some(reservedDate => {
          const [hours, minutes] = slot.value.split(':').map(Number);
          return reservedDate.getHours() === hours && reservedDate.getMinutes() === minutes;
        });

        // Si le créneau est réservé, marquer available à false
        if (isReserved) {
          slot.available = false;
        } else {
          slot.available = true;  // Optionnel : si tu veux remettre à true les créneaux qui ne sont plus réservés
        }
      });
    });
  }
  constructor(private primengConfig: PrimeNGConfig, private reservationService: ReservationService) {
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
  reservDay() {
    this.disabledDates = [...this.disabledDates, this.date];
  }
  daySelected() {

  }

  generateTimeSlots() {
    const startHour = 8; // Heure de début
    const endHour = 18; // Heure de fin
    const timeSlots: TimeSlot[] = [];

    for (let hour = startHour; hour < endHour; hour++) {
      timeSlots.push({
        value: `${this.formatTime(hour)}:00`,
        available: false
      });
      timeSlots.push({
        value: `${this.formatTime(hour)}:30`,
        available: true
      });
    }
    this.timeSlots = timeSlots;
  }

  // Fonction utilitaire pour formater les heures avec des zéros (ex: 08:00)
  formatTime(hour: number): string {
    return hour < 10 ? '0' + hour : hour.toString();
  }
  reservTimeSlot(timeSlot: TimeSlot) {
    const slot = this.timeSlots.find((slot: TimeSlot) => slot.value === timeSlot.value);
    if (slot) {
      this.selectedSlot = slot;

      const [hours, minutes] = this.selectedSlot.value.split(':').map(Number);

      // Créer une nouvelle date avec les heures et minutes ajustées
      const newDate = new Date(this.date);
      newDate.setHours(hours);
      newDate.setMinutes(minutes);
      newDate.setSeconds(0);

      // Mettre à jour this.date avec la nouvelle date
      this.date = newDate;
      this.reservationService.addReservation(this.date);
    }
  }
  cancelTimeSlot(timeSlot: TimeSlot) {
    const slot = this.timeSlots.find((slot: TimeSlot) => slot.value === timeSlot.value);

    if (slot) {
      this.selectedSlot = { value: "", available: true };

      // Extraire l'heure et les minutes du créneau annulé
      const [hours, minutes] = slot.value.split(':').map(Number);

      // Créer une nouvelle date à partir de this.date (date sélectionnée) en ajustant les heures et minutes
      const newDate = new Date(this.date);
      newDate.setHours(hours);
      newDate.setMinutes(minutes);
      newDate.setSeconds(0);

      // Informer le service que la date est annulée
      this.reservationService.cancelReservation(newDate);
      console.log(newDate);
    }
  }
}
