<?php

namespace App\Tests\Infrastructure\ValueObject\String;

use App\Infrastructure\Serialization\Json;
use PHPUnit\Framework\TestCase;
use Spatie\Snapshots\MatchesSnapshots;

class NonEmptyStringLiteralTest extends TestCase
{
    use MatchesSnapshots;

    public function testJsonSerialize(): void
    {
        $this->assertMatchesJsonSnapshot(
            Json::encode(TestNonEmptyStringLiteral::fromString('a'))
        );
    }

    public function testFromOptionalString(): void
    {
        self::assertNull(TestNonEmptyStringLiteral::fromOptionalString(null));
        self::assertEquals(
            'test',
            (string) TestNonEmptyStringLiteral::fromOptionalString('test')
        );
    }

    public function testToString(): void
    {
        static::assertEquals('a', (string) TestNonEmptyStringLiteral::fromString('a'));
    }

    public function testItShouldThrowWhenEmpty(): void
    {
        $this->expectException(\InvalidArgumentException::class);
        $this->expectExceptionMessage('App\Tests\Infrastructure\ValueObject\String\TestNonEmptyStringLiteral can not be empty');

        TestNonEmptyStringLiteral::fromString('');
    }
}
