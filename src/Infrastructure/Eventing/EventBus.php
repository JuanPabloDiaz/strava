<?php

declare(strict_types=1);

namespace App\Infrastructure\Eventing;

interface EventBus
{
    /**
     * @param DomainEvent[] $events
     */
    public function publishEvents(array $events): void;
}
