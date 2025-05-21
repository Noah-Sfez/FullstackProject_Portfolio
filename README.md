# Portfolio IIM

Ce projet est un portfolio destiné à l'IIM, permettant de présenter les réalisations des étudiants. Il vise à offrir une vitrine interactive et moderne des projets menés au sein de l'établissement.

## Objectifs

- Mettre en valeur les travaux des étudiants de l'IIM
- Faciliter la navigation et la découverte des projets
- Offrir une interface claire et responsive

## Fonctionnalités principales

- Présentation des projets par étudiant, catégorie ou promotion
- Fiches détaillées pour chaque réalisation (description, images, technologies utilisées)
- Recherche et filtres avancés
- Interface d'administration pour ajouter/modifier les projets

## Technologies envisagées

- Frontend : React.js / Next.js
- Backend : Symfony
- Base de données : MySQL

## Installation

```bash
git clone https://github.com/Noah-Sfez/FullstackProject_Portfolio.git
cd fullstackproject_portfolio

# Front

npm install
npm run dev

# Back

composer install
php bin/console doctrine:migrations:migrate
symfony serve
```

## Base de données et accès administrateur

Une base de données exportée est disponible dans le projet. Pour se connecter à l'interface d'administration:

- Email : admin@example.com
- Mot de passe : admin

## Contribution

Noah SFEZ
Antoine SCHMERBER-PERRAUD
Dimitri ZINDOVIC

## Licence

Ce projet est sous licence MIT.
