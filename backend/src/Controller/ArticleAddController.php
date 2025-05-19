<?php

namespace App\Controller;

use App\Entity\Article;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\Serializer\SerializerInterface;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;

#[AsController]
class ArticleAddController extends AbstractController
{
    public function __invoke(Request $request, SerializerInterface $serializer, EntityManagerInterface $em): JsonResponse
    {
        // Récupération de l'utilisateur connecté
        $user = $this->getUser();

        // Désérialisation de la requête
        $article = $serializer->deserialize($request->getContent(), Article::class, 'json');

        // Ajout de l'auteur à l'article
        $article->setAuthor($user);

        // Persistance de l'article
        $em->persist($article);
        $em->flush();

        // Retour de la réponse
        return new JsonResponse($article, 201);
    }
}