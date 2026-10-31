package com.impsswitch.plugin;

import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class PluginRegistry {

    // Stores each plugin using its bank code as the key.
    private final Map<String, BankPlugin> plugins = new HashMap<>();

    // Spring provides all available BankPlugin implementations.
    public PluginRegistry(List<BankPlugin> bankPlugins) {

        for (BankPlugin plugin : bankPlugins) {

            // Register each plugin automatically.
            plugins.put(
                    plugin.getBankCode().toUpperCase(),
                    plugin
            );
        }
    }

    // Find a plugin using its bank code.
    public BankPlugin getPlugin(String bankCode) {

        BankPlugin plugin = plugins.get(
                bankCode.toUpperCase()
        );

        if (plugin == null) {
            throw new IllegalArgumentException(
                    "No plugin registered for bank: " + bankCode
            );
        }

        return plugin;
    }
}