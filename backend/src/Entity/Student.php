<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiProperty;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use App\Repository\StudentRepository;
use Symfony\Component\Serializer\Attribute\Groups;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\MaxDepth;

#[ORM\Entity(repositoryClass: StudentRepository::class)]
#[ApiResource(
    operations: [
        new GetCollection(
            security: "is_granted('ROLE_ADMIN')",
            securityMessage: 'Acces refused : you are not allowed to see students.'
        ),
        new Post(
            security: "is_granted('ROLE_ADMIN')",
            securityMessage: 'Acces refused : you are not allowed to create this student.'
        ),
        new GetCollection(
            security: "is_granted('ROLE_ADMIN')",
            securityMessage: 'Acces refused : you are not allowed to see this student.'
        ),
        new Patch(
            security: "is_granted('ROLE_ADMIN')",
            securityMessage: 'Acces refused : you are not allowed to update this student.'
        ),
        new Delete(
            security: "is_granted('ROLE_ADMIN')",
            securityMessage: 'Acces refused : you are not allowed to delete this student.'
        ),
    ],
)]
class Student
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(groups: 'read')]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(groups: ['read', 'write'])]
    private ?string $name = null;

    #[ORM\Column(length: 255)]
    #[Groups(groups: ['read', 'write'])]
    private ?string $surname = null;

    /**
     * @var Collection<int, Project>
     */
    #[ORM\ManyToMany(targetEntity: Project::class, mappedBy: 'student')]
    #[Groups(groups: ['read'])]
    #[ApiProperty(fetchEager: false)]
    #[MaxDepth(1)]
    private Collection $projects;

    public function __construct()
    {
        $this->projects = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

    public function getSurname(): ?string
    {
        return $this->surname;
    }

    public function setSurname(string $surname): static
    {
        $this->surname = $surname;

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
            $project->addStudent($this);
        }

        return $this;
    }

    public function removeProject(Project $project): static
    {
        if ($this->projects->removeElement($project)) {
            $project->removeStudent($this);
        }

        return $this;
    }
}
