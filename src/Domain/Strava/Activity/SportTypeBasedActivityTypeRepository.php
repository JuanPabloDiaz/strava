<?php

declare(strict_types=1);

namespace App\Domain\Strava\Activity;

use App\Domain\Strava\Activity\SportType\SportType;
use App\Domain\Strava\Activity\SportType\SportTypeRepository;

final readonly class SportTypeBasedActivityTypeRepository implements ActivityTypeRepository
{
    public function __construct(
        private SportTypeRepository $sportTypeRepository,
    ) {
    }

    public function findAll(): ActivityTypes
    {
        $activityTypes = [];
        /** @var SportType $sportType */
        foreach ($this->sportTypeRepository->findAll() as $sportType) {
            $activityTypes[$sportType->getActivityType()->value] = $sportType->getActivityType();
        }

        return ActivityTypes::fromArray(array_values($activityTypes));
    }
}
