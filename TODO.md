Utiliser blocks angular.module().config() (configuration d'un module au boot)
Utiliser blocks angular.module().run() (block de code executé après l'instanciation de tous les bidules)

Voir ici : https://docs.angularjs.org/guide/module


Creer un "stub module" qui utilise les hooks de 4me.core.ui pour s'enregistrer, utiliser ce module pour tester les hooks

Choses à créer :
 * Service qui contient la liste des modules (?)
 * Service qui permet au module d'enregistrer/supprimer des notifications (avec lien direct vers contenu)
 * Voir ui-router et comment articuler les choses
 * Voir dashboard et enregistrement d'un widget (?)
 * Connaitre le statut de la position, envoyer un event lors du changement de secteurs
  * Chercher position depuis backend, si rien, alors afficher une erreur
  * Afficher "position fermée"
 * Gestion d'erreurs, par module et/ou globalement
