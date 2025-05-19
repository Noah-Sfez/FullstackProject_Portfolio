<?php

namespace App\Entity;

use App\Repository\MediaRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\OpenApi\Model;
use ApiPlatform\Metadata\ApiProperty;
use App\Controller\CreateMediaObjectAction;
use Symfony\Component\HttpFoundation\File\File;
use Vich\UploaderBundle\Mapping\Annotation as Vich;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Delete;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Serializer\Attribute\Groups;

#[Vich\Uploadable]
#[ApiResource(
    normalizationContext: ['groups' => ['read']],
    types: ['https://schema.org/MediaObject'],
    operations: [
        new Get(),
        new GetCollection(),
        new Delete(),
        new Post(
            controller: CreateMediaObjectAction::class,
            deserialize: false,
            validationContext: ['groups' => ['Default', 'write']],
            openapi: new Model\Operation(
                requestBody: new Model\RequestBody(
                    content: new \ArrayObject([
                        'multipart/form-data' => [
                            'schema' => [
                                'type' => 'object',
                                'properties' => [
                                    'file' => [
                                        'type' => 'string',
                                        'format' => 'binary'
                                    ]
                                ]
                            ]
                        ]
                    ])
                )
            )
        )
    ]
)]
#[ORM\Entity(repositoryClass: MediaRepository::class)]
class Media
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $filePath = null;

    #[ApiProperty(types: ['https://schema.org/contentUrl'])]
    #[Groups(['read'])]
    public ?string $contentUrl = null;

    #[Vich\UploadableField(mapping: 'media_object', fileNameProperty: 'filePath')]
    #[Assert\NotNull(groups: ['write'])]
    public ?File $file = null;

    /**
     * @var Collection<int, Project>
     */
    #[ORM\ManyToMany(targetEntity: Project::class, inversedBy: 'media')]
    private Collection $projects;

    public function __construct()
    {
        $this->projects = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getFilePath(): ?string
    {
        return $this->filePath;
    }

    public function setFilePath(?string $filePath): static
    {
        $this->filePath = $filePath;

        return $this;
    }

    /**
     * @return Collection<int, Project>
     */
    public function getProjects(): Collection
    {
        return $this->projects;
    }

    public function addProject(Project $project): static
    {
        if (!$this->projects->contains($project)) {
            $this->projects->add($project);
        }

        return $this;
    }

    public function removeProject(Project $project): static
    {
        $this->projects->removeElement($project);

        return $this;
    }
}
