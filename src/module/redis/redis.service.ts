// src/redis/redis.service.ts
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import Redis, { Redis as Client } from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: Client;

  onModuleInit() {
    this.client = new Redis({
      host: 'localhost', // Replace with your Redis host
      port: 6379, // Replace with your Redis port
    });

    this.client.on('connect', () => {
      console.log('Redis connected');
    });

    this.client.on('error', (err) => {
      console.error('Redis error:', err);
    });
  }

  onModuleDestroy() {
    this.client.quit();
  }

  getClient(): Client {
    return this.client;
  }

  async set(key: string, value: string, ttl?: number) {
    if (ttl) {
      await this.client.set(key, value, 'EX', ttl);
    } else {
      await this.client.set(key, value);
    }
  }

  async get(key: string): Promise<string> {
    return this.client.get(key);
  }

  async del(key: string) {
    await this.client.del(key);
  }
}
