package com.project.tinder_clone.utils;

import com.google.i18n.phonenumbers.PhoneNumberUtil;
import org.springframework.stereotype.Component;

@Component
public class PhoneNormalizer {
    private final PhoneNumberUtil util = PhoneNumberUtil.getInstance();

    /** Принимает строку от фронта. Можно с пробелами/скобками/дефисами, главное чтобы был +. */
    public String toE164(String raw) {
        try {
            // когда есть префикс '+', второй параметр можно передать null
            var proto = util.parse(raw, null);

            if (!util.isValidNumber(proto)) {
                throw new IllegalArgumentException("Invalid phone number");
            }

            return util.format(proto, PhoneNumberUtil.PhoneNumberFormat.E164);

        } catch (Exception e) {
            throw new IllegalArgumentException("Failed to parse phone number");
        }
    }
}
