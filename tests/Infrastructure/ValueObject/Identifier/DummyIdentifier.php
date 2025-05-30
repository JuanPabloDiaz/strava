<?php

declare(strict_types=1);

namespace App\Tests\Infrastructure\ValueObject\Identifier;

use App\Infrastructure\ValueObject\Identifier\Identifier;

final readonly class DummyIdentifier extends Identifier
{
    public static function getPrefix(): string
    {
        return 'dummy-';
    }
}
