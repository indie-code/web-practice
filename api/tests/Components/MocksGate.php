<?php
namespace Tests\Components;

use Gate;


trait MocksGate
{
    /**
     * @param $mock_alias
     * @param $state
     */
    protected function mockGate($mock_alias, $state)
    {
        Gate::before(function ($user, $ability, $argument = null) use ($mock_alias, $state) {
            if ($ability == $mock_alias) {
                return $state;
            }
        });
    }

    protected function allows($class, $rule)
    {
        return $this->mockPolicy($class, $rule, true);
    }

    protected function denies($class, $rule)
    {
        return $this->mockPolicy($class, $rule, false);
    }

    protected function mockPolicy($class, $rule, $return)
    {
        Gate::before(function ($user, $ability, $argument = null) use ($rule, $class, $return) {
            if ($ability == $rule && !empty($argument) && ($argument[0] instanceof $class || $argument[0] === $class)) {
                return $return;
            }
        });

        return $this;
    }
}
