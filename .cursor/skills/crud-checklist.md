# Checklist CRUD — Écrans Paramètres

> Mémo pour traiter chaque écran de paramétrage : vérifier la table DB, implémenter le CRUD, valider que tout fonctionne.

---

## 📋 Étapes systématiques

### 1. Analyse de la table en base de données
```bash
# Se connecter à la DB et décrire la table
docker exec -i oracle11g-host sqlplus -S test_accc/a <<'EOSQL'
SET PAGESIZE 200
SET LINESIZE 200
COL COLUMN_NAME FORMAT A25
COL DATA_TYPE FORMAT A15
COL NULLABLE FORMAT A8
SELECT COLUMN_ID, COLUMN_NAME, DATA_TYPE, DATA_LENGTH, NULLABLE, DATA_DEFAULT
FROM user_tab_columns
WHERE TABLE_NAME = 'NOM_TABLE'
ORDER BY COLUMN_ID;
EXIT;
EOSQL
```

**Vérifier** :
- [ ] Liste complète des colonnes (COLUMN_ID, nom, type, taille, NULLABLE)
- [ ] Colonnes NOT NULL (contraintes obligatoires)
- [ ] Clé primaire / colonne d'identification
- [ ] Colonnes avec contraintes FK (références vers d'autres tables)
- [ ] Colonnes avec des triggers (valeurs auto-générées)

---

### 2. Vérification du backend Java

**Fichiers à checker** :
- `creance-back/.../controller/*Controller.java`
- `creance-back/.../service/*Service.java`

**Dans le Service, vérifier la méthode `update()`** :
- [ ] **TOUS** les champs modifiables sont dans le `SET` (pas seulement dans le `WHERE`)
- [ ] Les champs NOT NULL sont bien traités (validation avant insertion)
- [ ] Le `INSERT` inclut toutes les colonnes obligatoires
- [ ] Le `DELETE` utilise la bonne clé d'identification

**Dans le Controller, vérifier** :
- [ ] Les endpoints CRUD existent : GET, POST, PUT, DELETE
- [ ] La validation des champs requis est correcte (`validateCreate`, `validateUpdate`)
- [ ] Les clés composites sont gérées correctement

---

### 3. Vérification du frontend

**Types TypeScript** :
- [ ] Les types correspondent aux **vraies colonnes DB** (pas de champs fictifs)
- [ ] Les champs obligatoires sont marqués `required`

**Service API** :
- [ ] Les appels API pointent vers les bons endpoints backend
- [ ] Le payload envoyé contient les bonnes clés (mapping `apiKey`)

**Hooks React Query** :
- [ ] `useXxx()` — récupère les données
- [ ] `useXxxPaginated()` — si pagination serveur
- [ ] `useCreateXxx()` — création
- [ ] `useUpdateXxx()` — mise à jour
- [ ] `useDeleteXxx()` — suppression

**Composants** :
- [ ] Formulaire : champs dans le bon ordre, disposition en 2 colonnes (`grid-cols-2`)
- [ ] Modal : largeur suffisante (`sm:max-w-2xl`)
- [ ] Affichage liste : tous les champs pertinents visibles
- [ ] Mapper dans `parameter-config.ts` : inclut TOUS les champs (y compris optionnels)

---

### 4. Tests de validation fonctionnelle

#### Bouton de recherche
- [ ] Le bouton loupe **apparaît** (condition `useServerPagination` correcte)
- [ ] La recherche envoie bien la requête au backend (vérifier `handleSearchSubmit`)
- [ ] Le reset de recherche fonctionne (vérifier `handleSearchReset`)
- [ ] Pour les écrans sans pagination serveur, la recherche client-side fonctionne (`localQuery` vs `query` dans `data-table.tsx`)

#### Création (Create)
- [ ] Le formulaire s'ouvre correctement
- [ ] Tous les champs obligatoires sont marqués `*`
- [ ] Le champ de référence (FK) est un select/searchable-select avec les bonnes options
- [ ] Les validations fonctionnent (champs vides, longueurs max)
- [ ] L'enregistrement est visible dans la DB après création

#### Modification (Update)
- [ ] En mode édition, **TOUS** les champs sont pré-remplis (vérifier le mapper dans `parameter-config.ts`)
- [ ] Les champs optionnels vides en DB s'affichent vides (pas `undefined` ou `null`)
- [ ] La modification du champ principal (libellé/code) **fonctionne en DB**
- [ ] Vérifier que le backend `UPDATE` inclut TOUS les champs modifiables dans le `SET`

#### Suppression (Delete)
- [ ] La confirmation s'affiche avant suppression
- [ ] La suppression fonctionne (bonnes clés d'identification)
- [ ] La liste se rafraîchit après suppression

#### Affichage
- [ ] Les cartes/liste affichent les **vrais champs DB** (pas de champs fictifs)
- [ ] Disposition en 2 colonnes dans les formulaires
- [ ] Modal assez large pour 2 colonnes
- [ ] Les colonnes du tableau correspondent aux données affichées

---

### 5. Checklist rapide avant livraison

| Vérification | OK |
|-------------|-----|
| Table DB décrite et colonnes identifiées | ☐ |
| Backend `update()` inclut TOUS les champs dans le `SET` | ☐ |
| Backend `create()` inclut TOUS les champs obligatoires | ☐ |
| Types TypeScript matchent les colonnes DB | ☐ |
| Mapper `parameter-config.ts` inclut TOUS les champs (y.c. optionnels) | ☐ |
| Formulaire en 2 colonnes, modal large (`max-w-2xl`) | ☐ |
| Bouton recherche visible et fonctionnel | ☐ |
| Recherche client-side fonctionne (`localQuery`) | ☐ |
| Mode édition pré-remplit TOUS les champs | ☐ |
| Création/modification/suppression testés en DB | ☐ |

---

## 🚨 Erreurs récurrentes à éviter

1. **Backend `update()` sans tous les champs** — Le champ n'est pas dans le `SET`, seulement dans le `WHERE` → impossible à modifier
2. **Champs fictifs** — Le formulaire utilise des champs qui n'existent pas dans la table DB
3. **Mapper incomplet** — Le mapper dans `parameter-config.ts` ne transmet pas les champs optionnels → vides en mode édition
4. **Bouton recherche invisible** — `onSearchSubmit` est `undefined` car la condition utilise `hookPaginated` au lieu de `useServerPagination`
5. **Recherche client-side cassée** — `filteredData` utilise `query` au lieu de `localQuery`
6. **Modal trop étroit** — `max-w-md` au lieu de `max-w-2xl` → champs écrasés en 2 colonnes
7. **Ordre des champs** — Le champ principal (ex: Code Banque) n'est pas en 1ère position

---

## 📝 Pattern type pour un nouvel écran

Pour chaque écran de paramétrage, appliquer dans l'ordre :

1. **Décrire la table DB** → lister colonnes, NOT NULL, FK
2. **Vérifier backend** → controller + service (CRUD complet)
3. **Vérifier frontend** → types, service API, hooks, composants
4. **Corriger les erreurs** → champs DB, ordre, 2 colonnes, mapper complet
5. **Tester** → création, modification, suppression, recherche
6. **Vérifier DB** → les modifications sont bien persistées
