import { t } from "i18next";
import Input from "../input/input";
import { HorizontalView, VerticalView } from "../view";
import { Button } from "../button/button";
import { colors } from "@/constant/colors";
import { KeyboardAvoidingView, Platform, Text } from "react-native";
import { StyleSheet } from "react-native";
import { myFontStyle } from "../responsive-text";
import { Link } from "expo-router";
import { author } from "@/constant/about-author";
import { useState } from "react";

export default function ActivateCodeSection() {
    const [code, setCode] = useState('');

    return (<KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <VerticalView alignItems="center" styles={styles.container} gap={8}>
            <HorizontalView alignItems='center' >
                <Text>
                    {t('hideAdsHere')}
                </Text>
                <Link style={styles.aboutAuthorLink} href={author.url}>
                    <Text style={styles.aboutAuthorText}>@leduybao.io.vn</Text>
                </Link>
            </HorizontalView>
            <HorizontalView>
                <Input
                    value={code}
                    onChangeText={(v) => { setCode(v) }}
                    placeholder={t('enterActivationCode')}
                    labelClassName="text-dark-grey-800"
                    inputStyle={{ borderRadius: 100 }}
                />
                <Button
                    title={t('activate')}
                    onClick={() => { }}
                    fullWidth={false}
                />
            </HorizontalView>
        </VerticalView>
    </KeyboardAvoidingView>)
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors['dark-grey'][200],
        padding: 8,
        borderRadius: 20,
        minWidth: '50%',
    },
    aboutAuthorLink: {
        color: colors['dark-grey'][900],
        textDecorationLine: 'underline',
        backgroundColor: colors['dark-grey'][300],
        paddingHorizontal: 8,
        borderRadius: 100,
        textAlign: 'center',
    },
    aboutAuthorText: {
        ...myFontStyle.small,
        fontWeight: 'bold',
    },
})