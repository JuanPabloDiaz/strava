<?php

declare(strict_types=1);

namespace App\Domain\Strava\Activity;

interface ActivityTypeRepository
{
    public function findAll(): ActivityTypes;
}
