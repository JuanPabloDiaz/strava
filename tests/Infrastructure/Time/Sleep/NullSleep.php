<?php

declare(strict_types=1);

namespace App\Tests\Infrastructure\Time\Sleep;

use App\Infrastructure\Time\Sleep;

class NullSleep implements Sleep
{
    public function sweetDreams(int $durationInSeconds): void
    {
    }
}
