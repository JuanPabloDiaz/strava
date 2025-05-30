<?php

declare(strict_types=1);

namespace App\Infrastructure\ValueObject\String;

abstract readonly class NonEmptyStringLiteral implements \JsonSerializable, \Stringable
{
    private string $value;

    final private function __construct(string $value)
    {
        $this->validate($value);
        $this->value = $value;
    }

    protected function validate(string $value): void
    {
        if ('' === trim($value)) {
            throw new \InvalidArgumentException(static::class.' can not be empty');
        }
    }

    public static function fromString(string $string): static
    {
        return new static($string);
    }

    public static function fromOptionalString(?string $string = null): ?static
    {
        if (!$string) {
            return null;
        }

        return new static($string);
    }

    public function __toString(): string
    {
        return $this->value;
    }

    public function jsonSerialize(): string
    {
        return (string) $this;
    }
}
