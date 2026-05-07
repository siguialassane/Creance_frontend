# 🏗️ Architecture du Système de Paiements

**Version** : 1.1.0  
**Date** : 7 mai 2026

---

## 📐 Vue d'Ensemble

```
┌─────────────────────────────────────────────────────────────────┐
│                      FRONTEND (Next.js/React)                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │  Paiement    │  │  Paiement    │  │  Paiement    │         │
│  │  Créances    │  │  Factures    │  │  Frais       │         │
│  └──────┬───────┘  └──────-┬──────┘  └──────--┬─────┘         │
│         │                  │                  │                  │
│         └──────────────────┴──────────────────┘                 │
│                            │                                     │
│                  ┌─────────▼─────────┐                          │
│                  │  RecuPaiement     │                          │
│                  │  Modal            │                          │
│                  └─────────┬─────────┘                          │
│                            │                                     │
│         ┌──────────────────┼──────────────────┐                │
│         │                  │                  │                 │
│  ┌──────▼───────┐  ┌──────▼───────┐  ┌──────▼───────┐         │
│  │ Paiement     │  │ Paiement     │  │ Paiement     │         │
│  │ Creance      │  │ Facture      │  │ Frais        │         │
│  │ Service      │  │ Service      │  │ Service      │         │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘         │
│         │                  │                  │                 │
│         └──────────────────┴──────────────────┘                 │
│                            │                                     │
└────────────────────────────┼─────────────────────────────────────┘
                             │
                    ┌────────▼────────┐
                    │   API Gateway   │
                    │  (Axios Client) │
                    └────────┬────────┘
                             │
┌────────────────────────────┼─────────────────────────────────────┐
│                      BACKEND (Spring Boot)                       │
├────────────────────────────┼─────────────────────────────────────┤
│                            │                                      │
│         ┌──────────────────┴──────────────────┐                 │
│         │                                      │                 │
│  ┌──────▼───────┐  ┌──────────────┐  ┌───────▼──────┐          │
│  │ AcPaiement   │  │ AcPaiement   │  │ AcPaiement   │          │
│  │ Creance      │  │ Facture      │  │ Frais        │          │
│  │ Service      │  │ Service      │  │ Service      │          │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │
│         │                  │                  │                  │
│         └──────────────────┴──────────────────┘                 │
│                            │                                     │
│                  ┌─────────▼─────────┐                          │
│                  │  RecuPaiement     │                          │
│                  │  Service          │                          │
│                  │  (JasperReports)  │                          │
│                  └─────────┬─────────┘                          │
│                            │                                     │
└────────────────────────────┼─────────────────────────────────────┘
                             │
                    ┌────────▼────────┐
                    │  Oracle 19c DB  │
                    │                 │
                    │  AC_PAIEMENT    │
                    │  AC_EFFET       │
                    │  AC_REGULARISATION │
                    │  AC_FRAIS       │
                    └─────────────────┘
```

---

## 🔄 Flux de Données Détaillé

### 1. Paiement Créance par Effet

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. FRONTEND - Saisie Utilisateur                                │
└─────────────────────────────────────────────────────────────────┘
    ↓
    User remplit le formulaire:
    - Code créance: "0102000041"
    - Mode: "EFFET"
    - Type effet: "Chèque" (code "02")
    - Numéro: "CHQ123456"
    - Banque: "SGBS Dakar"
    - Montant: 100 000 FCFA
    ↓
┌─────────────────────────────────────────────────────────────────┐
│ 2. FRONTEND - Validation & Envoi                                │
└─────────────────────────────────────────────────────────────────┘
    ↓
    PaiementCreanceService.create({
      creanceCode: "0102000041",
      modePaiement: "EFFET",
      typeEffet: "02",
      numeroEffet: "CHQ123456",
      banqueAgence: "SGBS_DAKAR",
      montantEffet: 100000,
      datePaiement: "2026-05-07",
      libellePaiement: "Paiement par chèque N° CHQ123456"
    })
    ↓
    POST /api/paiements/creance
    ↓
┌─────────────────────────────────────────────────────────────────┐
│ 3. BACKEND - AcPaiementCreanceService                           │
└─────────────────────────────────────────────────────────────────┘
    ↓
    a) Validation des données
    b) Mapping mode paiement: "EFFET" → "02" (Chèque)
    c) INSERT AC_EFFET
       ├─ EFFET_NUM = "CHQ123456"
       ├─ TYPEFT_CODE = "02"
       ├─ CREAN_CODE = "0102000041"
       ├─ BQAG_CODE = "SGBS_DAKAR"
       ├─ EFFET_MONT = 100000
       └─ EFFET_DATCREA = NOW()
    d) INSERT AC_PAIEMENT
       ├─ MODE_PAIE_CODE = "02" (Chèque)
       ├─ TYPAIE_CODE = "02" (Créance)
       ├─ CREAN_CODE = "0102000041"
       ├─ EFFET_NUM = "CHQ123456"
       ├─ PAIE_MONT = 100000
       ├─ PAIE_DATEFT = "2026-05-07"
       └─ PAIE_LIB = "Paiement par chèque N° CHQ123456"
    e) INSERT AC_REGULARISATION
       ├─ CREAN_CODE = "0102000041"
       ├─ REGUL_TYPE_CODE = "5" (Paiement)
       ├─ PAIE_CODE = {paieCode généré}
       ├─ REGUL_MONT = 100000
       ├─ REGUL_SOLDE = {solde_actuel - 100000}
       └─ REGUL_DATE = NOW()
    ↓
    Retour: {
      paieCode: 12345,
      effetNum: "CHQ123456",
      message: "Paiement enregistré avec succès"
    }
    ↓
┌─────────────────────────────────────────────────────────────────┐
│ 4. FRONTEND - Affichage Modal Reçu                              │
└─────────────────────────────────────────────────────────────────┘
    ↓
    RecuPaiementModal s'affiche avec:
    - paieCode: 12345
    - effetNum: "CHQ123456"
    - Bouton "Télécharger Reçu Combiné"
    ↓
    User clique sur "Télécharger Reçu Combiné"
    ↓
┌─────────────────────────────────────────────────────────────────┐
│ 5. FRONTEND - Demande PDF Combiné                               │
└─────────────────────────────────────────────────────────────────┘
    ↓
    PaiementService.getRecuCombine(12345, 'ALL')
    ↓
    GET /api/paiements/creance/12345/recu-combine?type=ALL
    ↓
┌─────────────────────────────────────────────────────────────────┐
│ 6. BACKEND - RecuPaiementService                                │
└─────────────────────────────────────────────────────────────────┘
    ↓
    a) Récupération données paiement (PAIE_CODE=12345)
    b) Récupération données créance (CREAN_CODE="0102000041")
    c) Récupération données débiteur
    d) Génération Page 1 (Créance) avec JasperReports
       ├─ Template: recu_paiement.jrxml
       ├─ Données: créance, débiteur, paiement
       └─ Logo SOGEFIHA + Filigrane
    e) Génération Page 2 (Facture) - Vide si pas de facture
    f) Génération Page 3 (Frais) - Vide si pas de frais
    g) Fusion des 3 pages en 1 PDF
    ↓
    Retour: PDF Blob (3 pages)
    ↓
┌─────────────────────────────────────────────────────────────────┐
│ 7. FRONTEND - Téléchargement PDF                                │
└─────────────────────────────────────────────────────────────────┘
    ↓
    Création URL Blob
    ↓
    Téléchargement automatique: recu_combine_12345.pdf
    ↓
    Toast: "Reçu combiné téléchargé avec succès (3 pages)"
```

---

## 🗂️ Structure des Données

### Paiement Créance (Frontend → Backend)

```typescript
{
  // Obligatoire
  creanceCode: string,              // Code de la créance
  libellePaiement: string,          // Libellé du paiement
  montantPaiement: number,          // Montant en FCFA
  datePaiement: string,             // Format ISO 8601
  modePaiement: "EFFET" | "ESPECE" | "BANQUE_REMBOURSEMENT",
  
  // Si modePaiement = "EFFET"
  typeEffet?: string,               // Code du type d'effet (02, 03, 05, 09, 10)
  numeroEffet?: string,             // Numéro du chèque/effet
  banqueAgence?: string,            // Code de la banque
  montantEffet?: number,            // Montant de l'effet
  
  // Si modePaiement = "BANQUE_REMBOURSEMENT"
  compteOperation?: string,         // Code du compte d'opération
  recuManuel?: string,              // Numéro de reçu manuel
  
  // Optionnel (paiement par aval)
  typePayeur?: "DEBITEUR_PRINCIPAL" | "AVAL",
  garantiePhysCode?: string         // Code de la garantie physique (aval)
}
```

### Réponse Backend

```typescript
{
  data: {
    paieCode: number,               // Code du paiement créé
    effetNum?: string,              // Numéro d'effet (si applicable)
    message: string                 // Message de confirmation
  },
  status: "SUCCESS",
  timestamp: string
}
```

### Structure PDF Combiné

```
┌─────────────────────────────────────────────────────────────────┐
│                         PAGE 1 - CRÉANCE                         │
├─────────────────────────────────────────────────────────────────┤
│  Logo SOGEFIHA                    Ministère des Finances        │
│                                                                  │
│  REÇU DE PAIEMENT N° {paieCode}                                 │
│                                                                  │
│  Créance N° : {creanceCode}                                     │
│  Débiteur   : {nom} {prenom}                                    │
│  Adresse    : {adresse}                                         │
│                                                                  │
│  Somme payée : {montant} FCFA                                   │
│  En lettres  : {montant_en_lettres}                             │
│                                                                  │
│  Mode        : {mode_paiement}                                  │
│  Banque      : {banque}                                         │
│  N° Chèque   : {numero_effet}                                   │
│                                                                  │
│  Date        : {date_paiement}                                  │
│  Heure       : {heure}                                          │
│                                                                  │
│  Reste à payer : {solde} FCFA                                   │
│                                                                  │
│  Signature                                                       │
│  [FILIGRANE SOGEFIHA]                                           │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      PAGE 2 - FACTURE/BAIL                       │
├─────────────────────────────────────────────────────────────────┤
│  (Vide si pas de paiement facture associé)                      │
│  Sinon : Reçu de loyer avec infos contrat                       │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                         PAGE 3 - FRAIS                           │
├─────────────────────────────────────────────────────────────────┤
│  (Vide si pas de paiement frais associé)                        │
│  Sinon : Reçu de frais avec type et montant                     │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🗄️ Schéma Base de Données

### Tables Principales

```sql
AC_PAIEMENT
├─ PAIE_CODE (PK)
├─ TYPAIE_CODE ('01'=Facture, '02'=Créance, '04'=Frais)
├─ MODE_PAIE_CODE ('01'=Espèces, '02'=Chèque, '05'=Effet, ...)
├─ CREAN_CODE (FK → AC_CREANCE)
├─ CONT_CODE (FK → AC_CONTRAT_BAIL)
├─ EFFET_NUM (FK → AC_EFFET)
├─ PAIE_MONT
├─ PAIE_DATCREA
├─ PAIE_DATEFT
└─ PAIE_LIB

AC_EFFET
├─ EFFET_NUM (PK)
├─ TYPEFT_CODE ('02'=Chèque, '03'=Traite, '05'=Effet, ...)
├─ CREAN_CODE (FK → AC_CREANCE)
├─ GARPHYS_CODE (FK → AC_GARANTIE_PHYSIQUE) [Optionnel pour aval]
├─ BQAG_CODE (FK → AC_BANQUE_AGENCE)
├─ EFFET_MONT
├─ EFFET_DATCREA
├─ EFFET_DATREMACC
└─ EFFET_DATEND

AC_REGULARISATION
├─ REGUL_CODE (PK)
├─ CREAN_CODE (FK → AC_CREANCE)
├─ REGUL_TYPE_CODE ('5'=Paiement, '0'=Solde initial, ...)
├─ PAIE_CODE (FK → AC_PAIEMENT)
├─ REGUL_MONT
├─ REGUL_SOLDE
├─ REGUL_DATE
└─ REGUL_MOTIF

AC_FRAIS
├─ FRAIS_CODE (PK)
├─ TYPFRAIS_CODE (FK → AC_TYPE_FRAIS)
├─ CREAN_CODE (FK → AC_CREANCE)
├─ CONT_CODE (FK → AC_CONTRAT_BAIL)
├─ PAIE_CODE (FK → AC_PAIEMENT)
├─ FRAIS_MONT
├─ FRAIS_MONT_PAY
├─ FRAIS_RESTE_A_PAY
└─ FRAIS_DATE_PAY
```

### Relations

```
AC_CREANCE ─┬─→ AC_PAIEMENT (CREAN_CODE)
            ├─→ AC_EFFET (CREAN_CODE)
            ├─→ AC_REGULARISATION (CREAN_CODE)
            └─→ AC_FRAIS (CREAN_CODE)

AC_PAIEMENT ─→ AC_REGULARISATION (PAIE_CODE)
            └─→ AC_EFFET (EFFET_NUM)

AC_EFFET ─→ AC_GARANTIE_PHYSIQUE (GARPHYS_CODE) [Optionnel]
         └─→ AC_BANQUE_AGENCE (BQAG_CODE)

AC_FRAIS ─→ AC_PAIEMENT (PAIE_CODE)
```

---

## 📂 Structure des Fichiers

```
Creance_frontend/
├── src/
│   ├── app/(app)/
│   │   ├── paiements_des_creances/
│   │   │   ├── page.tsx                    # Formulaire paiement créance
│   │   │   └── liste/
│   │   │       └── page.tsx                # Historique paiements
│   │   ├── paiement_contrat_bail/
│   │   │   └── page.tsx                    # Formulaire paiement facture
│   │   └── paiement_des_frais/
│   │       └── page.tsx                    # Formulaire paiement frais
│   ├── components/
│   │   └── modals/
│   │       └── RecuPaiementModal.tsx       # Modal génération reçus
│   ├── services/
│   │   ├── paiement.service.ts             # Service générique ✨ MODIFIÉ
│   │   ├── paiement-creance.service.ts     # Service créances
│   │   ├── paiement-facture.service.ts     # Service factures
│   │   └── paiement-frais.service.ts       # Service frais
│   └── types/
│       └── paiement.ts                     # Types TypeScript
├── CORRECTIONS_PAIEMENTS_FRONTEND.md       # Plan corrections ✨ NOUVEAU
├── CORRECTIONS_APPLIQUEES.md               # Résumé modifications ✨ NOUVEAU
├── GUIDE_TEST_PAIEMENTS.md                 # Guide de test ✨ NOUVEAU
├── SYNTHESE_CORRECTIONS_PAIEMENTS.md       # Vue d'ensemble ✨ NOUVEAU
├── ARCHITECTURE_PAIEMENTS.md               # Ce fichier ✨ NOUVEAU
├── CHANGELOG_PAIEMENTS.md                  # Historique versions ✨ NOUVEAU
└── README.md                               # Documentation principale ✨ MODIFIÉ
```

---

## 🔐 Sécurité

### Validation Frontend
- ✅ Validation des montants (> 0)
- ✅ Validation des champs obligatoires
- ✅ Validation des formats de date
- ✅ Validation des codes (créance, banque, etc.)

### Validation Backend
- ✅ Vérification de l'existence de la créance
- ✅ Vérification des soldes
- ✅ Validation des modes de paiement
- ✅ Validation des montants
- ✅ Transactions SQL atomiques

### Authentification
- ✅ JWT Token requis pour toutes les requêtes
- ✅ Vérification des permissions utilisateur
- ✅ Logs d'audit des paiements

---

## ⚡ Performance

### Optimisations Frontend
- ✅ React Query pour le cache des données
- ✅ Lazy loading des composants
- ✅ Debounce sur les recherches
- ✅ Pagination des listes

### Optimisations Backend
- ✅ Index sur les clés étrangères
- ✅ Requêtes SQL optimisées
- ✅ Cache JasperReports
- ✅ Pool de connexions Oracle

### Métriques Cibles
- Temps de réponse API : < 500ms
- Génération PDF : < 3s
- Chargement page : < 2s

---

## 🧪 Tests

### Tests Frontend
- [ ] Tests unitaires (Jest + React Testing Library)
- [ ] Tests d'intégration (Cypress)
- [ ] Tests E2E (Playwright)

### Tests Backend
- [x] Tests unitaires (JUnit)
- [x] Tests d'intégration (Spring Boot Test)
- [ ] Tests de charge (JMeter)

### Couverture Cible
- Frontend : > 80%
- Backend : > 90%

---

## 📊 Monitoring

### Logs
- Frontend : Console browser + Sentry
- Backend : Log4j + ELK Stack
- Base de données : Oracle Audit

### Métriques
- Nombre de paiements par jour
- Taux de succès/échec
- Temps de génération PDF
- Erreurs par type

---

**Maintenu par** : Équipe Développement SOGEFIHA  
**Dernière mise à jour** : 7 mai 2026
