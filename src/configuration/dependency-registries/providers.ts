import { DependencyContainer } from 'tsyringe';

import { ReviewProviderAdapter } from '../../domain/providers/review.provider.adapter';

interface ProviderInjectionArgs {
  container: DependencyContainer;
}

function setupProvidersInjection(args: ProviderInjectionArgs): void {
  const { container } = args;

  container.registerSingleton('ReviewProvider', ReviewProviderAdapter);
}

export { setupProvidersInjection };
