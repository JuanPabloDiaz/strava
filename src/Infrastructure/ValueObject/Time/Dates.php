<?php

namespace App\Infrastructure\ValueObject\Time;

final class Dates implements \Countable
{
    /** @var SerializableDateTime[] */
    private array $datesIndexedByDate;

    /**
     * @param SerializableDateTime[] $dates
     */
    private function __construct(array $dates)
    {
        $this->datesIndexedByDate = [];
        foreach ($dates as $date) {
            $this->datesIndexedByDate[$date->format('Y-m-d')] = $date;
        }
        \ksort($this->datesIndexedByDate);
    }

    /**
     * @param SerializableDateTime[] $dates
     */
    public static function fromDates(array $dates): self
    {
        return new self($dates);
    }

    public static function empty(): self
    {
        return new self([]);
    }

    public function getLatestDate(): SerializableDateTime
    {
        // @phpstan-ignore-next-line
        return \max($this->datesIndexedByDate);
    }

    public function getEarliestDate(): SerializableDateTime
    {
        // @phpstan-ignore-next-line
        return \min($this->datesIndexedByDate);
    }

    public function getLongestConsecutiveDateRange(): Dates
    {
        if (0 === count($this->datesIndexedByDate)) {
            return Dates::empty();
        }
        $mostConsecutiveDates = [];
        $currentConsecutiveDates = [];

        $keys = \array_keys($this->datesIndexedByDate);
        $count = 0;
        foreach ($this->datesIndexedByDate as $date) {
            if ($count > 0 && $date->modify('-1 day')->format('Y-m-d') != $this->datesIndexedByDate[$keys[$count - 1]]->format('Y-m-d')) {
                // Date is not consecutive.
                $currentConsecutiveDates = [];
            }
            $currentConsecutiveDates[] = $date;
            ++$count;

            if (count($currentConsecutiveDates) > count($mostConsecutiveDates)) {
                $mostConsecutiveDates = $currentConsecutiveDates;
            }
        }

        return Dates::fromDates($mostConsecutiveDates);
    }

    public function count(): int
    {
        return count($this->datesIndexedByDate);
    }
}
