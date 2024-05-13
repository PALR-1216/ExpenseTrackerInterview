import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), importProvidersFrom(provideFirebaseApp(() => initializeApp({"projectId":"expensetrackerinterview","appId":"1:845705175029:web:1b0bd6cf2b50f92b1bcabc","storageBucket":"expensetrackerinterview.appspot.com","apiKey":"AIzaSyAfTncE_GI8uUDw5cMLBbbCmDymGL9WOu0","authDomain":"expensetrackerinterview.firebaseapp.com","messagingSenderId":"845705175029","measurementId":"G-GGPG3N9KQB"}))), importProvidersFrom(provideAuth(() => getAuth())), importProvidersFrom(provideFirestore(() => getFirestore())), importProvidersFrom(provideStorage(() => getStorage())), provideCharts(withDefaultRegisterables())]
};
