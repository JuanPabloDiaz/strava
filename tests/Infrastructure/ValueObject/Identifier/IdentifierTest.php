<?php

namespace App\Tests\Infrastructure\ValueObject\Identifier;

use PHPUnit\Framework\TestCase;

class IdentifierTest extends TestCase
{
    public function testFormat(): void
    {
        $this->assertEquals(
            'dummy-test',
            DummyIdentifier::fromString('dummy-test')
        );
    }

    public function testItShouldThrowWhenInvalidPrefix(): void
    {
        $this->expectExceptionObject(
            new \InvalidArgumentException('Identifier does not start with prefix "dummy-", got: invalid')
        );

        DummyIdentifier::fromString('invalid');
    }
}
