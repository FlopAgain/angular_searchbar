import { Component, input, OnInit } from '@angular/core';
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
  imports: [CommonModule, FormsModule, DataViewModule, ButtonModule, CalendarModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent implements OnInit {
  date: Date = new Date();
  product = input.required<Product>();
  fr: any;

  // Liste des créneaux horaires
  timeSlots: TimeSlot[] = [];
  selectedSlot: TimeSlot = { value: new Date(), available: true, selected: false };
  disabledDates: Date[] = [
    new Date(2024, 8, 15), // 15 Septembre 2024
    new Date(2024, 8, 21), // 21 Septembre 2024
    new Date(2024, 9, 10), // 10 Octobre 2024
  ];
  reservedDates: Date[] = [];
  subscription: Subscription = new Subscription();

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

  ngOnInit() {
    // Générer les créneaux horaires de 30 minutes de 08:00 à 18:00
    this.generateTimeSlots();
    this.subscription = this.reservationService.reservedDates$.subscribe(dates => {

      this.reservedDates = dates;
      // Parcourir tous les créneaux horaires
      this.timeSlots.forEach(slot => {
        // Pour chaque créneau, vérifier s'il existe dans reservedDates
        const isReserved = this.reservedDates.some(reservedDate => reservedDate.getTime() === slot.value.getTime());

        // Si le créneau est réservé, marquer available à false
        slot.available = !isReserved;
        // Si réservé, désélectionner le créneau
        if (isReserved) {
          slot.available = false;
        }
      });
    });
  }

  generateTimeSlots() {
    const startHour = 8; // Heure de début
    const endHour = 18; // Heure de fin
    const timeSlots: TimeSlot[] = [];

    for (let hour = startHour; hour < endHour; hour++) {
      // Création des créneaux de 00 et 30 minutes pour chaque heure
      timeSlots.push({
        value: this.createDateWithTime(hour, 0),
        available: true,
        selected: false
      });
      timeSlots.push({
        value: this.createDateWithTime(hour, 30),
        available: true,
        selected: false
      });
    }
    this.timeSlots = timeSlots;
  }

  // Créer une date avec une heure et des minutes spécifiques
  createDateWithTime(hours: number, minutes: number): Date {
    const date = new Date(this.date);
    date.setHours(hours, minutes, 0, 0);
    return date;
  }

  reservTimeSlot(timeSlot: TimeSlot) {
    const slot = this.timeSlots.find(slot => slot.value.getTime() === timeSlot.value.getTime());
    if (slot) {
      // Désélectionner les autres créneaux
      this.timeSlots.forEach(s => (s.selected = false));

      this.selectedSlot = slot;
      this.selectedSlot.selected = true;

      // Mettre à jour la date avec l'heure du créneau
      this.date = new Date(this.selectedSlot.value);
      this.reservationService.addReservation(this.date);
    }
  }

  cancelTimeSlot(timeSlot: TimeSlot) {
    const slot = this.timeSlots.find(slot => slot.value.getTime() === timeSlot.value.getTime());

    if (slot) {
      this.selectedSlot = { value: new Date(), available: true, selected: false };

      // Désélectionner le créneau annulé
      slot.selected = false;

      // Informer le service que la date est annulée
      this.reservationService.cancelReservation(slot.value);
    }
  }

  reservDay() {
    this.disabledDates = [...this.disabledDates, this.date];
  }

  daySelected() {}
}
