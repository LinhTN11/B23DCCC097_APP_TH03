import colors from '../theme/colors';
import typography from '../theme/typography';

export const stackScreenOptions = {
  headerStyle: {
    backgroundColor: colors.card,
  },
  headerTintColor: colors.primary,
  headerTitleStyle: {
    color: colors.text,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
  },
  headerShadowVisible: false,
  contentStyle: {
    backgroundColor: colors.background,
  },
};
