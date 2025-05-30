<?php

declare(strict_types=1);

namespace App\Infrastructure\Time\Clock;

use App\Infrastructure\ValueObject\Time\SerializableDateTime;

interface Clock
{
    public function getCurrentDateTimeImmutable(): SerializableDateTime;
}
