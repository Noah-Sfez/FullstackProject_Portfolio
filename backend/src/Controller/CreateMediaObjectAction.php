<?php

namespace App\Controller;

use App\Entity\Media;
use Doctrine\ORM\EntityManagerInterface;
use Psr\Log\LoggerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpFoundation\File\UploadedFile;

#[AsController]
final class CreateMediaObjectAction extends AbstractController
{
  public function __invoke(Request $request, EntityManagerInterface $em, LoggerInterface $l): JsonResponse
  {
    $uploadedFile = $request->files->get('file');

    if (!$uploadedFile || !$uploadedFile instanceof UploadedFile) {
      throw new BadRequestHttpException('"file" is required and must be a valid upload');
    }

    $media = new Media();

    // $uploadDir = $this->getParameter('kernel.project_dir') . '/public/uploads';
    // $filename = uniqid() . '.' . $uploadedFile->guessExtension();

    // try {
    //   $uploadedFile->move($uploadDir, $filename);
    // } catch (\Exception $e) {
    //   $l->error('FILE ERROR: ' . $e->getMessage());
    //   throw new BadRequestHttpException('Error moving file');
    // }

    $media->file = $uploadedFile;

    $l->error('FILE OK');

    $em->persist($media);
    $em->flush();

    return new JsonResponse([
      'status' => 'success',
      'media' => [
        'id' => $media->getId(),
      ]
    ], 201);
  }
}