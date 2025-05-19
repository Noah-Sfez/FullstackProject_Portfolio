<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\ProjectRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ProjectRepository::class)]
#[ApiResource(
    forceEager: false,
    normalizationContext: ['groups' => ['read']],
    denormalizationContext: ['groups' => ['write']],
)]
class Project
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(type: Types::TEXT)]
    private ?string $description = null;

    #[ORM\Column(type: Types::INTEGER)]
    private ?int $date = null;

    #[ORM\Column(type: Types::TEXT)]
    private ?string $techno = null;

    /**
     * @var Collection<int, Student>
     */
    #[ORM\ManyToMany(targetEntity: Student::class, inversedBy: 'projects')]
    private Collection $student;

    /**
     * @var Collection<int, Media>
     */
    #[ORM\ManyToMany(targetEntity: Media::class, mappedBy: 'projects')]
    private Collection $media;

    #[ORM\Column]
    private ?bool $isActive = null;

    public function __construct()
    {
        $this->student = new ArrayCollection();
        $this->media = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): static
    {
        $this->description = $description;

        return $this;
    }

    public function getDate(): ?int
    {
        return $this->date;
    }

    public function setDate(int $date): static
    {
        $this->date = $date;

        return $this;
    }

    public function getTechno(): ?string
    {
        return $this->techno;
    }

    public function setTechno(string $techno): static
    {
        $this->techno = $techno;

        return $this;
    }

    /**
     * @return Collection<int, Student>
     */
    public function getStudent(): Collection
    {
        return $this->student;
    }

    public function addStudent(Student $student): static
    {
        if (!$this->student->contains($student)) {
            $this->student->add($student);
        }

        return $this;
    }

    public function removeStudent(Student $student): static
    {
        $this->student->removeElement($student);

        return $this;
    }

    /**
     * @return Collection<int, Media>
     */
    public function getMedia(): Collection
    {
        return $this->media;
    }

    public function addMedium(Media $medium): static
    {
        if (!$this->media->contains($medium)) {
            $this->media->add($medium);
            $medium->addProject($this);
        }

        return $this;
    }

    public function removeMedium(Media $medium): static
    {
        if ($this->media->removeElement($medium)) {
            $medium->removeProject($this);
        }

        return $this;
    }

    public function isActive(): ?bool
    {
        return $this->isActive;
    }

    public function setIsActive(bool $isActive): static
    {
        $this->isActive = $isActive;

        return $this;
    }
}
