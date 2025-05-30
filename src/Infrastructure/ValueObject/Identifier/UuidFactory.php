<?php

declare(strict_types=1);

namespace App\Infrastructure\ValueObject\Identifier;

interface UuidFactory
{
    public static function random(): string;
}
