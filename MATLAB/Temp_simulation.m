% Constants
T_initial = 269; % Initial nitrogen temperature in K (-4°C)
T_ambient = 298; % Ambient temperature in K (25°C)
h = 30; % Heat transfer coefficient (W/m²K)
pipe_length = 0.2; % Pipe length in meters
pipe_diameter_inner = 0.020; % Inner diameter (m)
pipe_diameter_outer = 0.024; % Outer diameter (m)
pipe_area = pi * pipe_diameter_inner * pipe_length; % Surface area in m²
cp_nitrogen = 1040; % Specific heat of nitrogen (J/kgK)
rho_nitrogen = 0.424; % Initial density (kg/m³)
velocity = 5; % Assumed flow velocity in m/s
mass_flow_rate = rho_nitrogen * velocity * (pi * (pipe_diameter_inner / 2)^2); % kg/s

% Differential equation for temperature recovery
temp_recovery = @(t, T) (h * pipe_area * (T_ambient - T)) / (mass_flow_rate * cp_nitrogen);

% Time simulation (0 to 5 seconds)
time_span = [0 5];
initial_condition = T_initial;
[t, T] = ode45(temp_recovery, time_span, initial_condition);

% Plot results
figure;
plot(t, T - 273.15, 'b', 'LineWidth', 2);
hold on;
yline(25, 'r--', 'LineWidth', 1.5);
xlabel('Time (s)');
ylabel('Temperature (°C)');
title('Nitrogen Feedline Temperature Recovery');
grid on;
legend('Nitrogen Temperature', 'Ambient Temperature');

% Find time to reach near ambient temperature (1°C below ambient)
time_to_recover = t(find(T >= (T_ambient - 1), 1));
fprintf('Time to recover to near ambient: %.2f seconds\n', time_to_recover);
