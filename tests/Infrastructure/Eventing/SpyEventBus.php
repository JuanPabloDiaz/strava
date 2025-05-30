<?php

declare(strict_types=1);

namespace App\Tests\Infrastructure\Eventing;

use App\Infrastructure\Eventing\DomainEvent;
use App\Infrastructure\Eventing\EventBus;

class SpyEventBus implements EventBus
{
    /** @var DomainEvent[] */
    private array $eventsToPublish = [];

    public function publishEvents(array $events): void
    {
        $this->eventsToPublish = [...$this->eventsToPublish, ...$events];
    }

    /**
     * @return DomainEvent[]
     */
    public function getPublishedEvents(): array
    {
        $eventsToPublish = $this->eventsToPublish;
        $this->eventsToPublish = [];

        return $eventsToPublish;
    }
}
