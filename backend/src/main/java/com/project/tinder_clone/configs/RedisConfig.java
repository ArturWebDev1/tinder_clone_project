package com.project.tinder_clone.configs;

import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;


@Configuration
@EnableCaching
public class RedisConfig {

    @Bean
    public RedisCacheManager cacheManager(RedisConnectionFactory cf) {
        var keySer   = new org.springframework.data.redis.serializer.StringRedisSerializer();
        var valSer   = new org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer();

        var config = org.springframework.data.redis.cache.RedisCacheConfiguration.defaultCacheConfig()
                .serializeKeysWith(org.springframework.data.redis.serializer.RedisSerializationContext
                        .SerializationPair.fromSerializer(keySer))
                .serializeValuesWith(org.springframework.data.redis.serializer.RedisSerializationContext
                        .SerializationPair.fromSerializer(valSer))
                .disableCachingNullValues();

        return org.springframework.data.redis.cache.RedisCacheManager
                .builder(cf)
                .cacheDefaults(config)
                .build();
    }
}
